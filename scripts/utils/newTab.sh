# Credit: https://stackoverflow.com/questions/7171725/open-new-terminal-tab-from-command-line-mac-os-x
# Alternative: https://www.npmjs.com/package/ttab

# Opens a new tab in the current Terminal window and optionally executes a command.
# When invoked via a function named 'newwin', opens a new Terminal *window* instead.
function newtab {

    # If this function was invoked directly by a function named 'newwin', we open a new *window* instead
    # of a new tab in the existing window.
    local funcName=$FUNCNAME
    local targetType='tab'
    local targetDesc='new tab in the active Terminal window'
    local makeTab=1
    case "${FUNCNAME[1]}" in
        newwin)
            makeTab=0
            funcName=${FUNCNAME[1]}
            targetType='window'
            targetDesc='new Terminal window'
            ;;
    esac

    # Command-line help.
    if [[ "$1" == '--help' || "$1" == '-h' ]]; then
        cat <<EOF
Synopsis:
    $funcName [-g|-G] [command [param1 ...]]

Description:
    Opens a $targetDesc and optionally executes a command.

    The new $targetType will run a login shell (i.e., load the user's shell profile) and inherit
    the working folder from this shell (the active Terminal tab).
    IMPORTANT: In scripts, \`$funcName\` *statically* inherits the working folder from the
    *invoking Terminal tab* at the time of script *invocation*, even if you change the
    working folder *inside* the script before invoking \`$funcName\`.

    -g (back*g*round) causes Terminal not to activate, but within Terminal, the new tab/window
      will become the active element.
    -G causes Terminal not to activate *and* the active element within Terminal not to change;
      i.e., the previously active window and tab stay active.

    NOTE: With -g or -G specified, for technical reasons, Terminal will still activate *briefly* when
    you create a new tab (creating a new window is not affected).

    When a command is specified, its first token will become the new ${targetType}'s title.
    Quoted parameters are handled properly.

    To specify multiple commands, use 'eval' followed by a single, *double*-quoted string
    in which the commands are separated by ';' Do NOT use backslash-escaped double quotes inside
    this string; rather, use backslash-escaping as needed.
    Use 'exit' as the last command to automatically close the tab when the command
    terminates; precede it with 'read -s -n 1' to wait for a keystroke first.

    Alternatively, pass a script name or path; prefix with 'exec' to automatically
    close the $targetType when the script terminates.

Examples:
    $funcName ls -l "\$Home/Library/Application Support"
    $funcName eval "ls \\\$HOME/Library/Application\ Support; echo Press a key to exit.; read -s -n 1; exit"
    $funcName /path/to/someScript
    $funcName exec /path/to/someScript
EOF
        return 0
    fi

    # Option-parameters loop.
    inBackground=0
    while (( $# )); do
        case "$1" in
            -g)
                inBackground=1
                ;;
            -G)
                inBackground=2
                ;;
            --) # Explicit end-of-options marker.
                shift   # Move to next param and proceed with data-parameter analysis below.
                break
                ;;
            -*) # An unrecognized switch.
                echo "$FUNCNAME: PARAMETER ERROR: Unrecognized option: '$1'. To force interpretation as non-option, precede with '--'. Use -h or --h for help." 1>&2 && return 2
                ;;
            *)  # 1st argument reached; proceed with argument-parameter analysis below.
                break
                ;;
        esac
        shift
    done

    # All remaining parameters, if any, make up the command to execute in the new tab/window.

    local CMD_PREFIX='tell application "Terminal" to do script'

        # Command for opening a new Terminal window (with a single, new tab).
    local CMD_NEWWIN=$CMD_PREFIX    # Curiously, simply executing 'do script' with no further arguments opens a new *window*.
        # Commands for opening a new tab in the current Terminal window.
        # Sadly, there is no direct way to open a new tab in an existing window, so we must activate Terminal first, then send a keyboard shortcut.
    local CMD_ACTIVATE='tell application "Terminal" to activate'
    local CMD_NEWTAB='tell application "System Events" to keystroke "t" using {command down}'
        # For use with -g: commands for saving and restoring the previous application
    local CMD_SAVE_ACTIVE_APPNAME='tell application "System Events" to set prevAppName to displayed name of first process whose frontmost is true'
    local CMD_REACTIVATE_PREV_APP='activate application prevAppName'
        # For use with -G: commands for saving and restoring the previous state within Terminal
    local CMD_SAVE_ACTIVE_WIN='tell application "Terminal" to set prevWin to front window'
    local CMD_REACTIVATE_PREV_WIN='set frontmost of prevWin to true'
    local CMD_SAVE_ACTIVE_TAB='tell application "Terminal" to set prevTab to (selected tab of front window)'
    local CMD_REACTIVATE_PREV_TAB='tell application "Terminal" to set selected of prevTab to true'

    if (( $# )); then # Command specified; open a new tab or window, then execute command.
            # Use the command's first token as the tab title.
        local tabTitle=$1
        case "$tabTitle" in
            exec|eval) # Use following token instead, if the 1st one is 'eval' or 'exec'.
                tabTitle=$(echo "$2" | awk '{ print $1 }') 
                ;;
            cd) # Use last path component of following token instead, if the 1st one is 'cd'
                tabTitle=$(basename "$2")
                ;;
        esac
        local CMD_SETTITLE="tell application \"Terminal\" to set custom title of front window to \"$tabTitle\""
            # The tricky part is to quote the command tokens properly when passing them to AppleScript:
            # Step 1: Quote all parameters (as needed) using printf '%q' - this will perform backslash-escaping.
        local quotedArgs=$(printf '%q ' "$@")
            # Step 2: Escape all backslashes again (by doubling them), because AppleScript expects that.
        local cmd="$CMD_PREFIX \"${quotedArgs//\\/\\\\}\""
            # Open new tab or window, execute command, and assign tab title.
            # '>/dev/null' suppresses AppleScript's output when it creates a new tab.
        if (( makeTab )); then
            if (( inBackground )); then
                # !! Sadly, because we must create a new tab by sending a keystroke to Terminal, we must briefly activate it, then reactivate the previously active application.
                if (( inBackground == 2 )); then # Restore the previously active tab after creating the new one.
                    osascript -e "$CMD_SAVE_ACTIVE_APPNAME" -e "$CMD_SAVE_ACTIVE_TAB" -e "$CMD_ACTIVATE" -e "$CMD_NEWTAB" -e "$cmd in front window" -e "$CMD_SETTITLE" -e "$CMD_REACTIVATE_PREV_APP" -e "$CMD_REACTIVATE_PREV_TAB" >/dev/null
                else
                    osascript -e "$CMD_SAVE_ACTIVE_APPNAME" -e "$CMD_ACTIVATE" -e "$CMD_NEWTAB" -e "$cmd in front window" -e "$CMD_SETTITLE" -e "$CMD_REACTIVATE_PREV_APP" >/dev/null
                fi
            else
                osascript -e "$CMD_ACTIVATE" -e "$CMD_NEWTAB" -e "$cmd in front window" -e "$CMD_SETTITLE" >/dev/null
            fi
        else # make *window*
            # Note: $CMD_NEWWIN is not needed, as $cmd implicitly creates a new window.
            if (( inBackground )); then
                # !! Sadly, because we must create a new tab by sending a keystroke to Terminal, we must briefly activate it, then reactivate the previously active application.
                if (( inBackground == 2 )); then # Restore the previously active window after creating the new one.
                    osascript -e "$CMD_SAVE_ACTIVE_WIN" -e "$cmd" -e "$CMD_SETTITLE" -e "$CMD_REACTIVATE_PREV_WIN" >/dev/null
                else
                    osascript -e "$cmd" -e "$CMD_SETTITLE" >/dev/null
                fi
            else
                    # Note: Even though we do not strictly need to activate Terminal first, we do it, as assigning the custom title to the 'front window' would otherwise sometimes target the wrong window.
                osascript -e "$CMD_ACTIVATE" -e "$cmd" -e "$CMD_SETTITLE" >/dev/null
            fi
        fi        
    else    # No command specified; simply open a new tab or window.
        if (( makeTab )); then
            if (( inBackground )); then
                # !! Sadly, because we must create a new tab by sending a keystroke to Terminal, we must briefly activate it, then reactivate the previously active application.
                if (( inBackground == 2 )); then # Restore the previously active tab after creating the new one.
                    osascript -e "$CMD_SAVE_ACTIVE_APPNAME" -e "$CMD_SAVE_ACTIVE_TAB" -e "$CMD_ACTIVATE" -e "$CMD_NEWTAB" -e "$CMD_REACTIVATE_PREV_APP" -e "$CMD_REACTIVATE_PREV_TAB" >/dev/null
                else
                    osascript -e "$CMD_SAVE_ACTIVE_APPNAME" -e "$CMD_ACTIVATE" -e "$CMD_NEWTAB" -e "$CMD_REACTIVATE_PREV_APP" >/dev/null
                fi
            else
                osascript -e "$CMD_ACTIVATE" -e "$CMD_NEWTAB" >/dev/null
            fi
        else # make *window*
            if (( inBackground )); then
                # !! Sadly, because we must create a new tab by sending a keystroke to Terminal, we must briefly activate it, then reactivate the previously active application.
                if (( inBackground == 2 )); then # Restore the previously active window after creating the new one.
                    osascript -e "$CMD_SAVE_ACTIVE_WIN" -e "$CMD_NEWWIN" -e "$CMD_REACTIVATE_PREV_WIN" >/dev/null
                else
                    osascript -e "$CMD_NEWWIN" >/dev/null
                fi
            else
                    # Note: Even though we do not strictly need to activate Terminal first, we do it so as to better visualize what is happening (the new window will appear stacked on top of an existing one).
                osascript -e "$CMD_ACTIVATE" -e "$CMD_NEWWIN" >/dev/null
            fi
        fi
    fi

}

########################################################################
# Function to open a new tab based on whether the OS is linux or macOSx
########################################################################
openTab(){
    command_start=$1
    command=$2
    if [ $command_start == "bash" ] 
    then
        gnome-terminal -x bash -c "$command; exec bash"
    else
        newtab $command
    fi
}
