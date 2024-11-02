variable "bucket_name" {
  default = "btc-price-guesser-client"
  description = "The name of the bucket"
}

variable "aws_region" {
  type = string
  default = "eu-central-1"
}

variable "github_token" {
  type        = string
  description = "github token to connect github repo"
}

variable "repository" {
  type        = string
  description = "github repo url"
  default     = "https://github.com/JonasSchulz/BTC-price-guesser"
}

variable "app_name" {
  type        = string
  description = "AWS Amplify App Name"
  default     = "btc-price-guesser-client"
}

variable "branch_name" {
  type        = string
  description = "AWS Amplify App Repo Branch Name"
  default     = "main"
}

variable "domain_name" {
  type        = string
  default     = "awsamplifyapp.com" #change this to your custom domain
  description = "AWS Amplify Domain Name"
}