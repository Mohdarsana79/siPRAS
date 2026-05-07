<!DOCTYPE html>
<html>
<head>
    <title>Kode OTP Reset Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="text-align: center; color: #4F46E5;">siPRAS</h2>
        <p>Halo,</p>
        <p>Anda menerima email ini karena kami menerima permintaan reset password untuk akun Anda.</p>
        <p>Berikut adalah kode OTP Anda. Kode ini berlaku selama 15 menit.</p>
        <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; padding: 10px 20px; font-size: 24px; font-weight: bold; background-color: #F3F4F6; border-radius: 8px; letter-spacing: 5px;">
                {{ $otp }}
            </span>
        </div>
        <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
        <br>
        <p>Salam hangat,</p>
        <p><strong>Tim siPRAS</strong></p>
    </div>
</body>
</html>
