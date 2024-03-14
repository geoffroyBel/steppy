
const { withAndroidManifest, withMainActivity } = require('@expo/config-plugins');

function setHealthConnectManifest(config) {
  return withAndroidManifest(config, async (config) => {
    const manifest = config.modResults.manifest;

    // Add the PermissionsRationaleActivity
    const permissionsRationaleActivity = {
      '$': {
        'android:name': '.PermissionsRationaleActivity',
        'android:exported': 'true'
      },
      'intent-filter': [{
        'action': [{
          '$': {
            'android:name': 'androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE'
          }
        }]
      }]
    };

    // Add the ViewPermissionUsageActivity alias
    const viewPermissionUsageActivityAlias = {
      '$': {
        'android:name': 'ViewPermissionUsageActivity',
        'android:exported': 'true',
        'android:targetActivity': '.PermissionsRationaleActivity',
        'android:permission': 'android.permission.START_VIEW_PERMISSION_USAGE'
      },
      'intent-filter': [{
        'action': [{
          '$': {
            'android:name': 'android.intent.action.VIEW_PERMISSION_USAGE'
          }
        }],
        'category': [{
          '$': {
            'android:name': 'android.intent.category.HEALTH_PERMISSIONS'
          }
        }]
      }]
    };

    // Check if the activity and alias already exist in the AndroidManifest
    if (!manifest.application[0].activity.some(activity => activity['$']['android:name'] === '.PermissionsRationaleActivity')) {
      manifest.application[0].activity.push(permissionsRationaleActivity);
    }

    if (!manifest.application[0]['activity-alias']) {
      manifest.application[0]['activity-alias'] = [];
    }

    if (!manifest.application[0]['activity-alias'].some(alias => alias['$']['android:name'] === 'ViewPermissionUsageActivity')) {
      manifest.application[0]['activity-alias'].push(viewPermissionUsageActivityAlias);
    }

    return config;
  });
}

module.exports = (config) => {
  config = withMainActivity(config, async (config) => {
    if (config.modResults.language === 'java') {
      throw new Error('HealthConnectPlugin does not support Java');
    } else {
      // Add the import statements at the top of the file
      config.modResults.contents = config.modResults.contents.replace(
        'package com.healthconnectexample;',
        `package com.healthconnectexample;

import android.os.Bundle;
import dev.matinzd.healthconnect.permissions.HealthConnectPermissionDelegate;`
      );

      // Add the onCreate method modifications
      config.modResults.contents = config.modResults.contents.replace(
        'super.onCreate(null);',
        `super.onCreate(savedInstanceState);
// In order to handle permission contract results, we need to set the permission delegate.
HealthConnectPermissionDelegate.setPermissionDelegate(this);`
      );
    }
    // Corrected to have only one return statement
    return config;
  });

  config = setHealthConnectManifest(config);

  return config;
};
