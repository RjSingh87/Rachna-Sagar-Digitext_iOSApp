#import "AppDelegate.h"
#import <React/RCTLinkingManager.h>
// #import "RNSplashScreen.h"

#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate


- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  
  NSString *urlString = url.absoluteString;
  NSDictionary *userInfo =
  [NSDictionary dictionaryWithObject:urlString forKey:@"appInvokeNotificationKey"];
  [[NSNotificationCenter defaultCenter] postNotificationName:
   @"appInvokeNotification" object:nil userInfo:userInfo];
  return [RCTLinkingManager application:app openURL:url options:options];
}


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"Orientation";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  // [RNSplashScreen show];  // here
  // // or
  // //[RNSplashScreen showSplash:@"LaunchScreen" inRootView:rootView];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}



- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
