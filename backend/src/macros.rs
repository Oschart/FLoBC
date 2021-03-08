#[macro_export]
macro_rules! get_static {
    ($a: expr) => {
        unsafe {
            $a.load(Ordering::SeqCst)
        }
    };
}
