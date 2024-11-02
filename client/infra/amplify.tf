resource "aws_amplify_app" "btc_price_guesser_client" {
  name       = var.app_name
  repository = var.repository #This will be your reactjs project

  access_token             = var.github_token
  enable_branch_auto_build = true

  # The default build_spec added by the Amplify Console for React.
  build_spec = <<-EOT
    version: 0.1
    frontend:
      phases:
        preBuild:
          commands:
            - cd client
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: ./client/build
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
  EOT

  # The default rewrites and redirects added by the Amplify Console.
  custom_rule {
    source = "/<*>"
    status = "404"
    target = "/index.html"
  }

  environment_variables = {
    Name           = "hello-world"
    Provisioned_by = "Terraform"
  }
}

resource "aws_amplify_branch" "amplify_branch" {
  app_id            = aws_amplify_app.btc_price_guesser_client.id
  branch_name       = var.branch_name
  enable_auto_build = true
}

resource "aws_amplify_domain_association" "domain_association" {
  app_id                = aws_amplify_app.btc_price_guesser_client.id
  domain_name           = var.domain_name
  wait_for_verification = false

  sub_domain {
    branch_name = aws_amplify_branch.amplify_branch.branch_name
    prefix      = var.branch_name
  }
}
