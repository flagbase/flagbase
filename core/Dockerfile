FROM golang:1.17.10-alpine
LABEL maintainer="Flagbase Team <hello@flagbase.com>"

# Set up working environment
RUN apk add --no-cache git bash openssh
WORKDIR /go/src/github.com/flagbase/flagbase/core
COPY . .

# Download dependencies
RUN go mod download
RUN go get -u github.com/cosmtrek/air

# Build executable
RUN go build -o ./bin/flagbased ./cmd/flagbased

# Expose relevant ports
EXPOSE 5051
