FROM golang:1.20.2
LABEL maintainer="Flagbase Team <hello@flagbase.com>"

# Set up working environment
RUN apk add --no-cache git bash openssh
WORKDIR /go/src/github.com/flagbase/flagbase/core
COPY . .

# Download dependencies
RUN go mod download

# Build executable
RUN go build -o ./bin/flagbased ./cmd/flagbased

# Expose relevant ports
EXPOSE 5051
EXPOSE 7051
EXPOSE 8080
EXPOSE 9051

ENTRYPOINT ["/go/src/github.com/flagbase/flagbase/core/bin/flagbased"]