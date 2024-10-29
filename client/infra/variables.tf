variable "bucket_name" {
  default = "btc-price-guesser-client"
  description = "The name of the bucket"
}

variable "aws_region" {
  type = string
  default = "eu-central-1"
}