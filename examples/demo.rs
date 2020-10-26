use exonum_cli::NodeBuilder;

// these includes are suggested by verbose error messages
use cryptocurrency::contracts::CryptocurrencyService;
use exonum_cli::Spec;

//tokio is a library that rewrites the main for you, so you can have it as async
//include tokio in Cargo.toml
// main taken from exonum github
#[tokio::main]
async fn main() -> anyhow::Result<()> {
    exonum::helpers::init_logger()?;
    NodeBuilder::development_node()?
        // .with_default_rust_service is not impelemented for NodeBuilder
        // .with_default_rust_service(CryptocurrencyService)
        .with(Spec::new(CryptocurrencyService).with_default_instance())
        .run()
        .await
}
