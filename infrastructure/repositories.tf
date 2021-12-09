provider "aws" {
  region = var.region
  shared_credentials_file = "$HOME/.aws/credentials"
}

resource "aws_ecr_repository" "unguard-frontend" {
  name                 = "${var.prefix}-frontend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "unguard-user-simulator" {
  name                 = "${var.prefix}-user-simulator"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "unguard-microblog-service" {
  name                 = "${var.prefix}-microblog-service"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "unguard-proxy-service" {
  name                 = "${var.prefix}-proxy-service"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "unguard-user-auth-service" {
  name                 = "${var.prefix}-user-auth-service"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "unguard-ad-service" {
  name                 = "${var.prefix}-ad-service"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}