# Gmail Email Configuration Guide for HRMS Password Reset

This guide provides step-by-step instructions for setting up Gmail email sending for the HRMS password reset functionality.

## Prerequisites

- Gmail account
- Google Cloud Console access
- Spring Boot application with mail dependencies

## Step 1: Enable 2-Factor Authentication

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification**
3. Follow the prompts to enable 2-factor authentication
4. This is required to generate app passwords

## Step 2: Generate App Password

1. In Google Account settings, go to **Security** → **2-Step Verification**
2. Scroll down to **App passwords**
3. Click **Select app** → **Mail**
4. Click **Select device** → **Other (custom name)**
5. Enter "HRMS Application" as the name
6. Click **Generate**
7. **Copy the 16-character app password** (you'll need this for Spring Boot configuration)

## Step 3: Alternative - OAuth2 Setup (Recommended for Production)

### Create Google Cloud Project

1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Create a new project or select existing one
3. Enable the Gmail API:
   - Go to **APIs & Services** → **Library**
   - Search for "Gmail API"
   - Click **Enable**

### Create OAuth2 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client IDs**
3. Configure OAuth consent screen if prompted:
   - Choose **External** user type
   - Fill in required fields (App name, User support email, Developer contact)
   - Add scopes: `https://www.googleapis.com/auth/gmail.send`
4. Create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Name: "HRMS Email Service"
   - Authorized redirect URIs: `http://localhost:8080/oauth2/callback`
5. Download the JSON credentials file

## Step 4: Environment Configuration

### Option A: App Password Method (Simpler)

Create or update your `.env` file in the backend root directory:

```env
# Database Configuration
DB_URL=jdbc:postgresql://localhost:5432/hrms_db
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password

# Gmail Configuration (App Password Method)
GMAIL_USERNAME=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Anthropic API Key
anthropic.api.key=your-anthropic-key
```

### Option B: OAuth2 Method (Production Recommended)

```env
# Database Configuration
DB_URL=jdbc:postgresql://localhost:5432/hrms_db
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password

# Gmail OAuth2 Configuration
GMAIL_CLIENT_ID=your-oauth2-client-id
GMAIL_CLIENT_SECRET=your-oauth2-client-secret
GMAIL_REFRESH_TOKEN=your-refresh-token
GMAIL_USERNAME=your-email@gmail.com

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Anthropic API Key
anthropic.api.key=your-anthropic-key
```

## Step 5: Spring Boot Configuration

The application.properties file is already configured. Ensure these properties are set:

```properties
# Email configuration for Gmail
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${GMAIL_USERNAME}
spring.mail.password=${GMAIL_APP_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.ssl.trust=smtp.gmail.com

# Frontend URL for password reset links
app.frontend.url=${FRONTEND_URL:http://localhost:5173}
```

## Step 6: Testing Email Configuration

### Test Email Sending

1. Start your Spring Boot application
2. Use the forgot password endpoint:

```bash
curl -X POST http://localhost:8080/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"identifier": "test-user@example.com"}'
```

3. Check the application logs for any email sending errors
4. Verify the email is received in the target inbox

### Common Issues and Solutions

#### Issue: "Username and Password not accepted"
- **Solution**: Ensure 2FA is enabled and you're using the app password, not your regular Gmail password

#### Issue: "Authentication failed"
- **Solution**: Double-check the app password is correctly copied (no spaces)

#### Issue: "Connection timeout"
- **Solution**: Check firewall settings and ensure port 587 is open

#### Issue: "SSL/TLS errors"
- **Solution**: Verify the SMTP configuration and trust settings

## Step 7: Security Best Practices

### Environment Variables
- Never commit `.env` files to version control
- Add `.env` to your `.gitignore` file
- Use different credentials for development and production

### Production Deployment
- Use OAuth2 instead of app passwords for production
- Store credentials in secure environment variable services
- Enable email rate limiting
- Monitor email sending for abuse

### Email Content Security
- Use HTTPS for password reset links
- Implement token expiration (10 minutes)
- Log email sending attempts for security monitoring

## Step 8: Deployment Configuration

### Docker Environment
```dockerfile
ENV GMAIL_USERNAME=your-email@gmail.com
ENV GMAIL_APP_PASSWORD=your-app-password
ENV FRONTEND_URL=https://your-domain.com
```

### Cloud Platform Environment Variables
Set these environment variables in your cloud platform:
- `GMAIL_USERNAME`
- `GMAIL_APP_PASSWORD` (or OAuth2 credentials)
- `FRONTEND_URL`
- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`

## Troubleshooting

### Enable Debug Logging
Add to application.properties for debugging:
```properties
logging.level.org.springframework.mail=DEBUG
logging.level.com.sun.mail=DEBUG
```

### Test SMTP Connection
Use this simple test to verify SMTP connectivity:
```bash
telnet smtp.gmail.com 587
```

### Verify Gmail Settings
- Ensure "Less secure app access" is disabled (use app passwords instead)
- Check Gmail account for any security alerts
- Verify the account isn't locked or suspended

## Support

If you encounter issues:
1. Check the application logs for detailed error messages
2. Verify all environment variables are correctly set
3. Test with a simple email client first
4. Consult Gmail's official SMTP documentation

For production deployments, consider using dedicated email services like SendGrid, AWS SES, or Mailgun for better deliverability and monitoring capabilities.
