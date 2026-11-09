// Edit these when you publish a new build.
// Put the APK at public/downloads/finlyt-latest.apk (or point apkUrl at a GitHub release / Drive link).
export const APP = {
  name: 'Finlyt',
  version: '0.2.1',
  apkUrl: '/downloads/finlyt-latest.apk',
  apkSize: '57 MB',
  minAndroid: 'Android 7.0+',
  updated: 'Nov 2026',
}

export const formatINR = (n) => `₹${Number(n).toLocaleString('en-IN')}`
