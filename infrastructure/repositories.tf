provider "aws" {
  region = var.region
  shared_credentials_file = "$HOME/.aws/credentials"
  profile = "dtRoleAccountAdmin"
}

resource "aws_ecr_repository" "vogelgrippe-frontend" {
  name                 = "${var.prefix}-vogelgrippe-frontend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "vogelgrippe-loadgenerator" {
  name                 = "${var.prefix}-loadgenerator"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "vogelgrippe-microblog-service" {
  name                 = "${var.prefix}-microblog-service"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "vogelgrippe-proxy-service" {
  name                 = "${var.prefix}-proxy-service"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "vogelgrippe-user-auth-service" {
  name                 = "${var.prefix}-user-auth-service"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}