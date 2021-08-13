terraform {
  required_version = ">= 1.0.0"

  backend "s3" {
    bucket = "ground-zero-infrastructure"
    key    = "ground-zero-ecr.tfstate"
    region = "us-east-1"
  }

  required_providers {
    aws = ">= 3.54.0"
  }
}