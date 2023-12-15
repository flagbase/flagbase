use core::models::*;
use core::establish_connection;
use diesel::prelude::*;
use core::create_post;

fn main() {
    use core::schema::posts::dsl::*;

    let connection = &mut establish_connection();

    create_post(connection, "Hello", "Hello world!");

    let results = posts
        .filter(published.eq(true))
        .limit(5)
        .select(Post::as_select())
        .load(connection)
        .expect("Error loading posts");

    println!("Displaying {} posts", results.len());
    for post in results {
        println!("{}", post.title);
        println!("-----------\n");
        println!("{}", post.body);
    }
}