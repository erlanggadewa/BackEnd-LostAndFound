export function generateOtpView(otp: string) {
  return `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a
          href=""
          style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600"
        >
          TelU Lost and Found
        </a>
      </div>
      <p style="font-size:1.1em">Verification Account,</p>
      <p>
        Terimakasih telah menggunakan aplikasi kami. Gunakan kode OTP berikut untuk menyelesaikan akses account anda. Harap jangan bagikan kode OTP anda
      </p>
      <h1 style="background: #00466a;margin: 0 auto;width: max-content;padding: 1px 12px;color: #fff;border-radius: 4px;">
        ${otp}
      </h1>
      <p style="font-size:0.9em;">
        <br />
        Jika terdapat kendala, anda dapat hubungi kami di WhatsApp 082241922849 (Erlangga Dewa Sakti)
      </p>
      <p style="font-size:0.9em;">
        Regards,
        <br />
        Bakau Team ~ Telkom University
      </p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>Erlangga Dewa Sakti ~ 6706201053</p>
        <p>Iqbal Arrafi ~ 6706204091</p>
        <p>David Marsen Purba ~ 6706201142</p>
      </div>
    </div>
  </div>`;
}
