terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.73.0"
    }
  }
  required_version = ">= 1.1.0"
}


variable "aws_region" {
  default = "eu-central-1"
}

provider "aws" {
  region = "${var.aws_region}"
}
