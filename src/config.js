// Edit these when you publish a new build.
// Put the APK at public/downloads/finlyt-latest.apk (or point apkUrl at a GitHub release / Drive link).
export const APP = {
  name: 'Finlyt',
  version: '1.0.0',
  apkUrl: '/downloads/finlyt-latest.apk',
  apkSize: '~25 MB',
  minAndroid: 'Android 8.0+',
  updated: 'Nov 2026',
}

export const formatINR = (n) => `₹${Number(n).toLocaleString('en-IN')}`
