# BlueGate Store — راه‌اندازی کامل

این پروژه نسخه یکپارچه فروشگاه BlueGate است و VPN، Telegram Stars و Telegram Premium را در یک Storefront و یک پنل Admin جمع می‌کند.

## امکانات
- VPN: ساخت/ویرایش/حذف/مخفی کردن پلن و پکیج از Admin
- Stars: Base تومان یا USDT، درصد سود مستقل حتی 0٪، Slider و Quick Select
- Premium: پلن‌های 3/6/12 ماهه پیش‌فرض و قابلیت ساخت/حذف پلن، Base USDT، درصد سود پیش‌فرض یا Override هر پلن
- تخفیف: All / VPN / Stars / Premium، درصد، حداقل سفارش، تاریخ انقضا و سقف استفاده
- Checkout واحد و رسید آماده Telegram به آیدی تنظیم‌شده
- نرخ USDT/Toman از Wallex + Nobitex و TRX/TON از بازار عمومی
- Supabase Auth + RLS + Audit Log
- FAQ، Reviews، Tutorials، Features و Comparison قابل ویرایش
- PWA و GitHub Pages

## 1) Supabase
یک Project بساز و فایل `supabase/setup.sql` را کامل داخل SQL Editor اجرا کن.

در Authentication یک User ادمین بساز. UUID آن را بردار و اجرا کن:

```sql
insert into public.admin_users(user_id)
values('YOUR-USER-UUID')
on conflict(user_id) do nothing;
```

Signup عمومی را خاموش کن.

## 2) config.js
در `js/config.js` مقدارها را قرار بده:

```js
window.BG_CONFIG = {
  SUPABASE_URL: "https://YOURPROJECT.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "YOUR-PUBLISHABLE-KEY",
  RATE_FUNCTION_NAME: "market-rates",
  FALLBACK_USDT_TOMAN: 192000,
  RATE_REFRESH_SECONDS: 60
};
```

Service Role Key نباید داخل Frontend یا GitHub قرار بگیرد.

## 3) Edge Function نرخ‌ها
داخل پوشه پروژه:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase functions deploy market-rates --no-verify-jwt
```

بعد آدرس زیر را تست کن:

```text
https://YOUR_PROJECT_REF.supabase.co/functions/v1/market-rates
```

باید JSON شامل `usdt_toman`, `trx_usd`, `ton_usd` برگردد.

## 4) اجرا Local
Windows: `start-local.bat`

macOS/Linux: `./start-local.sh`

بعد:

```text
http://localhost:8000
http://localhost:8000/admin/
```

## 5) GitHub Pages
محتویات همین پوشه را در Root یک Repository آپلود کن. سپس:

Settings → Pages → Deploy from a branch → main → /(root)

## Admin VPN
مسیر Admin → VPN برای هر Plan این‌ها را مدیریت می‌کند:
- Slug
- Title
- Theme
- Icon
- Subtitle
- Note
- Pills
- Sort order
- Active/Hidden

و داخل هر Plan، هر تعداد Package می‌توانی Add/Edit/Delete کنی؛ Label، Price، Sort و Active قابل تغییر است.

## قیمت‌گذاری
VPN قیمت مستقیم تومانی دارد.

Stars:
`Base × (1 + markup/100) × quantity`

Premium:
`Base USDT × (1 + markup/100) × USDT/Toman`

درصد سود می‌تواند دقیقاً `0` باشد. برای Premium هر پلن می‌تواند Markup اختصاصی داشته باشد؛ خالی بماند از درصد عمومی Premium استفاده می‌کند.

## تخفیف
جدول discount_codes برای عموم قابل خواندن نیست. صفحه فروشگاه فقط RPC امن `validate_discount` را صدا می‌زند.

## مهاجرت از پروژه‌های قبلی
این نسخه عمداً پروژه مستقل است. برای جلوگیری از تداخل schema قدیمی، پیشنهاد می‌شود یک Supabase Project جدید بسازی. داده‌های پیش‌فرض VPN از BluePrice و قیمت‌های Premium/Stars از پروژه Telegram در `setup.sql` قرار گرفته‌اند.

## تفکیک اطلاعات Public و Private
قیمت پایه و درصد سود Stars/Premium فقط در `store_settings` و `premium_plans` قرار دارند و برای anon قابل SELECT نیستند. فروشگاه عمومی فقط `public_settings` و `premium_public` را می‌خواند که قیمت فروش نهایی را دارند. بنابراین API عمومی مستقیماً Cost/Markup ادمین را برنمی‌گرداند.


## v4 - TON and Admin stability
- GRAM با TON (The Open Network) جایگزین شده است.
- برای نرخ TON بهتر است Edge Function دوباره Deploy شود: `npx supabase functions deploy market-rates --no-verify-jwt`
- دیتابیس جدید یا Migration لازم نیست.
- پنل Admin حالا اگر یک جدول یا Policy مشکل داشته باشد، کامل سفید نمی‌شود و نام بخش مشکل‌دار را نمایش می‌دهد.


## نسخه Storefront v5
این نسخه فقط رابط کاربری سمت مشتری را بازطراحی می‌کند و دیتابیس/Admin قبلی را تغییر نمی‌دهد. برای آپدیت GitHub کافی است فایل‌های نسخه جدید را جایگزین و Commit کنید.


Storefront v6: visual/conversion redesign only. No database migration required.


## Storefront v9
بخش VPN شامل Active Plan Expansion، کم‌رنگ شدن پلن‌های دیگر، Best For، visual شبکه، package tiles، نشان صرفه‌جویی، خلاصه انتخاب و CTA بهبود یافته است.
