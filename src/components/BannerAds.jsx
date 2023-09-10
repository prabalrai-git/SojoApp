import React from 'react';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';

const BannerAds = ({adMobIdsMemo, adInterval}) => {
  return adInterval && adMobIdsMemo
    ? adMobIdsMemo.map((adItem, index) => {
        if ((index + 1) % adInterval === 0) {
          return (
            <BannerAd
              key={adItem._data.adId} // Make sure to provide a unique key
              unitId={adItem._data.adId}
              size="100x300"
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
            />
          );
        }
        return null;
      })
    : null; // Return null if adInterval or adMobIdsMemo are not available
};

export default React.memo(BannerAds);
