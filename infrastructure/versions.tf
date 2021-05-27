terraform {
  required_version = ">= 0.15.1"

  backend "s3" {
    bucket = "ground-zero-infrastructure"
    key    = "terraform-ecr.tfstate"
    region = "us-east-1"
  }

  required_providers {
    aws = ">= 3.38.0"
  }
}