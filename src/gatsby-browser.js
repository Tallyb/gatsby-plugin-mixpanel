import React from 'react';
import mixpanel from 'mixpanel-browser';
import MixpanelProvider from 'react-mixpanel';

const isEnable = options =>
  (process.env.NODE_ENV === `production` || options.enableOnDevMode) &&
  options.apiToken;

const getOptions = options =>
  Object.assign(
    {},
    {
      apiToken: null,
      enableOnDevMode: true,
      debug: false,
    },
    options
  );

exports.onRouteUpdate = ({ location }, pluginOptions) => {
  const options = getOptions(pluginOptions);

  if (!isEnable(options)) {
    return;
  }

  if (options.pageViews) {
    const mixpanelEvent = options.pageViews[location.pathname];
    if (mixpanelEvent) {
      mixpanel.track(mixpanelEvent, location);
    }
  }
};

exports.onClientEntry = (skip, pluginOptions) => {
  const options = getOptions(pluginOptions);

  if (!isEnable(options)) {
    mixpanel.init('disable', { autotrack: false });
    mixpanel.disable();
    return;
  }

  mixpanel.init(options.apiToken, { debug: options.debug });
}

exports.wrapPageElement = ({ element }) => {
  return (
    <MixpanelProvider mixpanel={mixpanel}>
      { element }
    </MixpanelProvider>
  );
};
