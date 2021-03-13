#[macro_export]
/// Loads the value of a static variable
macro_rules! get_static {
    ($a: expr) => {
        unsafe {
            $a.load(Ordering::SeqCst)
        }
    };
}
