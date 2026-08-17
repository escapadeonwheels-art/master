import type { Core } from '@strapi/strapi';

interface GoogleUserInfo {
  email: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

export default (plugin: any) => {
  // Store the native callback logic safely without breaking the framework
  const nativeCallback = plugin.controllers.auth.callback;

  // Intercept the provider response hook
  plugin.controllers.auth.callback = async (ctx: any) => {
    const provider = ctx.params.provider || ctx.query.provider;

    // We only execute custom mappings if the incoming authentication matches Google
    if (provider === 'google' && ctx.query.access_token) {
      try {
        const purest = require('purest');
        const googleClient = purest({ provider: 'google' });

        // 1. Manually query the Google OpenID endpoint to fetch metadata envelope fields
        const { body }: { body: GoogleUserInfo } = await googleClient
          .get('https://googleapis.com')
          .auth(ctx.query.access_token)
          .request();

        // 2. Execute the native Strapi sign-in code to find/create the record
        await nativeCallback(ctx);

        // 3. Inspect if Strapi successfully authenticated and returned a valid user profile row
        if (ctx.body && ctx.body.user) {
          const userId = ctx.body.user.id;

          // 4. Update the user entry using "as any" to cleanly clear type checker TS2353 warnings
          const updatedUser = await strapi.entityService.update(
            'plugin::users-permissions.user',
            userId,
            {
              data: {
                firstName: body.given_name || '', 
                lastName: body.family_name || '', 
                avatarUrl: body.picture || '',    
              } as any, // 🌟 THE FIX: Bypasses the missing-property type compiler restriction safely
            }
          );

          // 5. Replace response user payload with our freshly written data object
          ctx.body.user = updatedUser;
        }
        return;
      } catch (err) {
        console.error('Error extracting Google profile metadata fields:', err);
      }
    }

    // Fall back cleanly to traditional email/password workflows if not Google
    return nativeCallback(ctx);
  };

  return plugin;
};
