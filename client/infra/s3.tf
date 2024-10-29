resource "aws_s3_bucket" "react-aws-terraform-github-actions-s3-bucket" {
  bucket = var.bucket_name
  acl = "public-read"
  policy = data.aws_iam_policy_document.s3-website-policy.json

  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}