import AppShell from "@/components/AppShell";
import { T } from "@/components/LocaleProvider";

const apkUrl = "https://github.com/Abdo1629/exotic-vehicle-systems/releases/download/mobile-latest/exotic-racing.apk";

export default function DownloadPage() {
  return (
    <AppShell active="download" title="Download app">
      <div className="content download-content">
        <section className="download-hero">
          <div className="download-copy">
            <div className="eyebrow"><span className="eyebrow-line" /><T en="EXOTIC RACING / ANDROID" ar="إكزوتيك ريسينج / أندرويد" /></div>
            <h1><T en="Your team. In your pocket" ar="فريقك الهندسي في هاتفك" /><span className="title-period">.</span></h1>
            <p className="subtitle"><T en="Install the Android companion app for vehicle overview, battery status, diagnostics, test notes and Pit Mode checklist." ar="ثبّت تطبيق الفريق على أندرويد لمتابعة ملخص المركبة وحالة البطارية والتشخيصات وملاحظات الاختبار وقائمة وضع الصيانة." /></p>
            <div className="download-actions">
              <a className="download-button" href={apkUrl}>
                <span className="download-button-icon" aria-hidden="true">↓</span>
                <span><strong><T en="Download APK" ar="تنزيل ملف APK" /></strong><small><T en="Android · Team test build" ar="أندرويد · نسخة اختبار للفريق" /></small></span>
              </a>
              <span className="download-build-note"><T en="The link serves the latest successfully published team build." ar="الرابط يقدّم أحدث نسخة للفريق تم بناؤها ونشرها بنجاح." /></span>
            </div>
          </div>
          <div className="download-art" aria-hidden="true">
            <div className="download-art-orbit orbit-one" /><div className="download-art-orbit orbit-two" />
            <div className="download-phone">
              <div className="download-phone-camera" />
              <div className="download-phone-brand"><span>ER</span><div><b>EXOTIC</b><small>VEHICLE SYSTEMS</small></div></div>
              <div className="download-phone-label">BATTERY STATUS</div>
              <div className="download-phone-reading">— <small>%</small></div>
              <div className="download-phone-track"><span /></div>
              <div className="download-phone-cards"><i /><i /><i /></div>
              <div className="download-phone-bottom"><i /><i /><i /><i /></div>
            </div>
            <span className="download-art-caption">ENGINEERED FOR THE TEAM</span>
          </div>
        </section>

        <section className="download-details-grid">
          <article className="panel-card download-info-card">
            <div className="panel-heading"><div><h2><T en="Install on Android" ar="التثبيت على أندرويد" /></h2><p><T en="A quick one-time setup" ar="إعداد بسيط لمرة واحدة" /></p></div><span className="download-step-mark">01</span></div>
            <ol className="download-steps">
              <li><span>1</span><div><strong><T en="Download the APK" ar="نزّل ملف APK" /></strong><p><T en="Tap the download button above and wait for the file to finish." ar="اضغط زر التنزيل وانتظر اكتمال تحميل الملف." /></p></div></li>
              <li><span>2</span><div><strong><T en="Allow this installation" ar="اسمح بالتثبيت من هذا المصدر" /></strong><p><T en="If Android asks, allow your browser to install this file. Only proceed if you trust this team build." ar="إذا طلب أندرويد ذلك، اسمح للمتصفح بتثبيت الملف. تابع فقط إذا كنت تثق في نسخة الفريق هذه." /></p></div></li>
              <li><span>3</span><div><strong><T en="Install and open" ar="ثبّت التطبيق وافتحه" /></strong><p><T en="Open the downloaded file and follow Android's installation prompt." ar="افتح الملف بعد تنزيله واتبع تعليمات التثبيت على أندرويد." /></p></div></li>
            </ol>
          </article>
          <article className="panel-card download-info-card">
            <div className="panel-heading"><div><h2><T en="Before you install" ar="قبل التثبيت" /></h2><p><T en="Important build and data notes" ar="ملاحظات مهمة عن النسخة والبيانات" /></p></div><span className="download-step-mark">02</span></div>
            <ul className="download-notes">
              <li><span className="download-note-dot" /><p><T en="This is an internal team-test APK, not a Play Store production release." ar="هذه نسخة APK للاختبار الداخلي للفريق وليست إصدارًا إنتاجيًا على متجر Play." /></p></li>
              <li><span className="download-note-dot" /><p><T en="Android may show a warning because the app is installed outside Google Play." ar="قد يعرض أندرويد تحذيرًا لأن التطبيق يُثبّت من خارج متجر Google Play." /></p></li>
              <li><span className="download-note-dot" /><p><T en="Live vehicle readings remain unavailable until the approved backend and hardware gateway are configured." ar="ستظل قراءات المركبة المباشرة غير متاحة حتى إعداد الخادم المعتمد ووسيط الأجهزة." /></p></li>
              <li><span className="download-note-dot" /><p><T en="Use only builds published from the official Exotic Racing Team repository." ar="استخدم فقط النسخ المنشورة من مستودع فريق إكزوتيك ريسينج الرسمي." /></p></li>
            </ul>
            <a className="download-release-link" href="https://github.com/Abdo1629/exotic-vehicle-systems/releases" target="_blank" rel="noreferrer"><T en="View build history on GitHub" ar="عرض سجل الإصدارات على GitHub" /> ↗</a>
          </article>
        </section>
      </div>
    </AppShell>
  );
}
