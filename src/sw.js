import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'LifeTrack Notification';
  const options = {
    body: data.body || 'You have a new update!',
    icon: '/favicon.png',
    badge: '/favicon.png'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
