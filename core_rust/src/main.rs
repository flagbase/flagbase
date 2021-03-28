use actix_web::{get, post, web, App, middleware::Logger, HttpResponse, HttpServer, Responder};
use log::LevelFilter;

use env_logger::Env;
use env_logger::Builder;

mod health_check;

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("G'day, World!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::Builder::from_env(Env::default().default_filter_or("info")).init();

    HttpServer::new(|| {
        App::new()
            .wrap(Logger::default())
            .service(hello)
    })
    .bind("0.0.0.0:5051")?
    .run()
    .await
}
