const { withMainActivity } = require('@expo/config-plugins');

module.exports = (config) => {
  return withMainActivity(config, async (config) => {
    if (config.modResults.language === 'java') {
      throw new Error('HealthConnectPlugin does not support Java');
    } else {
      // Ensure we're not adding import statements multiple times
      if (!config.modResults.contents.includes('import dev.matinzd.healthconnect.permissions.HealthConnectPermissionDelegate')) {
        // Add the import statements at the top of the file
        config.modResults.contents = config.modResults.contents.replace(
          'package com.healthconnectexample;',
          `package com.healthconnectexample;

import android.os.Bundle;
import dev.matinzd.healthconnect.permissions.HealthConnectPermissionDelegate;`
        );
      }

      // Ensure we're not adding the permission delegate multiple times
      if (!config.modResults.contents.includes('HealthConnectPermissionDelegate.setPermissionDelegate(this)')) {
        // Add the onCreate method modifications
        config.modResults.contents = config.modResults.contents.replace(
          'super.onCreate(savedInstanceState);',
          `super.onCreate(savedInstanceState);
// In order to handle permission contract results, we need to set the permission delegate.
HealthConnectPermissionDelegate.setPermissionDelegate(this);`
        );
      }
    }
    return config;
  });
};
