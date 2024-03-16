FROM rust:latest
LABEL maintainer="Flagbase Team <hello@flagbase.com>"

RUN sudo apt-get install libssl-dev

# Set up working environment
WORKDIR /usr/flagbase
COPY . .

# Download dependencies
RUN cargo install cargo-watch

# Set the PATH so that the cargo binaries are available
RUN export PATH=$PATH:/root/.cargo/bin

# Build executable
RUN cargo install --path .

# Expose relevant ports
EXPOSE 5051
