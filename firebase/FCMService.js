import messaging from '@react-native-firebase/messaging';
import {ThemeConsumer} from 'react-native-elements';
import {cos, not} from 'react-native-reanimated';

class FCMService {
  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister);
    this.createNotificationListeners(
      onRegister,
      onNotification,
      onOpenNotification,
    );
  };

  checkPermission = (onRegister) => {
    messaging()
      .hasPermission()
      .then((enabled) => {
        if (enabled) {
          this.getToken(onRegister);
        } else {
          //User doesnt have permission
          this.requestPermission(onRegister);
        }
      })
      .catch((error) => {
        console.log('Permission rejected', error);
      });
  };

  getToken = (onRegister) => {
    messaging()
      .getToken()
      .then((fcmToken) => {
        if (fcmToken) {
          onRegister(fcmToken);
        } else {
          console.log('User doesnt have a device token');
        }
      })
      .catch((error) => {
        console.log('getToken rejected', error);
      });
  };

  requestPermission = (onRegister) => {
    messaging()
      .requestPermission()
      .then(() => {
        this.getToken(onRegister);
      })
      .catch((error) => {
        console.log('Request Permission rejected', error);
      });
  };

  deleteToken = () => {
    messaging()
      .deleteToken()
      .catch((error) => {
        console.log('Delete Token error', error);
      });
  };

  createNotificationListeners = (
    onRegister,
    onNotification,
    onOpenNotification,
  ) => {
    //trigger when notification is recieved in foregorund
    this.notificationListener = firebase
      .notifications()
      .onNotification((notification: Notification) => {
        onNotification(notification);
      });

    //If your app is in background, you can listen to notification as
    this.NotificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notificationOpen: NotificationOpen) => {
        onOpenNotification(notfication);
      });

    //if app is closed
    firebase
      .notifications()
      .getInitialNotification()
      .then((notificationOpen) => {
        if (notificationOpen) {
          const notification: Notification = notificationOpen.notification;
          onOpenNotification(notification);
        }
      });

    //triggered when data only
    this.messageListener = firebase.messaging().onMessage((mesage) => {
      onNotification(mesage);
    });

    //Triggered when new Token
    this.onTokenRefreshListener = firebase
      .messaging()
      .onTokenRefresh((fcmToken) => {
        console.log('New token', fcmToken);
      });
    onRegister(fcmToken);
  };

  unRegister = () => {
    this.notificationListener();
    this.NotificationOpenedListener();
    this.messageListener();
    this.onTokenRefreshListener();
  };

  buildChannel = (obj) => {
    return new firebase.notifications.Android.Channel(
      obj.channelID,
      obj.channelName,
      firebase.notifications.Android.Importance.High,
    ).setDescription(obj.channelDes);
  };

  buildNotification = (obj) => {
    //For android
    firebase.notifications().android.createChannel(obj.channel);

    //   For android and ios
    return (
      new firebase.notifications.Notification()
        .setSound(obj.sound)
        .setNotificationId(obj.dataId)
        .setTitle(obj.title)
        .setBody(obj.content)
        .setData(obj.data)

        //for android
        .android.setChannelId(obj.channel.channelID)
        .android.setLargeIcon(obj.largeIcon)
        .android.setSmallIcon(obj.smallIcon)
        .android.setColor(obj.colorBgIcon)
        .android.setPriority(firebase.notifications.Android.Priority.High)
        .android.setVibrate(obj.vibrate)
    );
  };

  scheduleNotification = (notification, days, minutes) => {
    const date = new Date();
    if (days) {
      date.setDate(date.getDate() + days);
    }
    if (minutes) {
      date.setMinutes(date.getMinutes() + minutes);
    }

    firebase
      .notifications()
      .scheduleNotification(notification, {fireData: date.getTime()});
  };

  displayNotification = (notification) => {
    firebase
      .notifications()
      .displayNotification(notification)
      .catch((error) => console.log('Display notificatipn error', error));
  };

  removeDeliveredNotification = (notification) => {
    firebase
      .notifications()
      .removeDeliveredNotification(notification.notficationId);
  };
}

export const fcmService = new FCMService();
