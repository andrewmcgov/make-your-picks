const path = require('path');

module.exports = {
  sassOptions: {
    prependData: `
        $desktop-width: 1000px;
        $desktop-up: 501px;
        $mobile-down: 500px;
        
        @mixin mobile {
          @media (max-width: #{$mobile-down}) {
            @content;
          }
        }
        
        @mixin desktop {
          @media (min-width: #{$desktop-up}) {
            @content;
          }
        }
      `,
  },
};
