FROM rust:latest
LABEL maintainer="Flagbase Team <hello@flagbase.com>"

# Set up working environment
WORKDIR /usr/flagbase
COPY . .

# Download dependencies
RUN cargo install cargo-watch
RUN export PATH=$PATH:/root/.cargo/bin

# Build executable
RUN cargo install --path .

# Expose relevant ports
EXPOSE 5051
