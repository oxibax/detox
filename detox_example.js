import { by, element, expect, device } from 'detox';
import { DETOX_USER_ONE } from './constants';

describe('Existing user logs in flow', () => {
  beforeAll(async () => {
    await device.launchApp({
      permissions: {
        location: 'always',
        notifications: 'YES',
        photos: 'YES',
        calendar: 'YES',
      },
    });
  });

  afterAll(async () => {
    await detox.cleanup();
  });


  it('should open auth sheet', async () => {
    await element(by.id('controlsButton')).tap();
    await expect(element(by.id('authSheet'))).toBeVisible();
  });


  it('should log in to the test user', async () => {
    await element(by.id('signInButton')).tap();

    await element(by.id('emailInput')).typeText(DETOX_USER_ONE.email);
    await element(by.id('passwordInput')).typeText(`${DETOX_USER_ONE.password}\n`);
    await waitFor(element(by.id('writeOn'))).toBeVisible().withTimeout(200);

    await expect(element(by.id('writeOn'))).toBeVisible();
  });


  it('should be able to create post with text only', async () => {
    await element(by.id('writeOn')).tap();
    await element(by.id('postCreationWriteOn')).typeText("Woohoo! Hahahaha");
    await element(by.id('postButtonOnCreatePost')).tap();
    await expect(element(by.id('writeOn'))).toBeVisible();
  });

  it('should be able to create post with image only', async () => {
    await element(by.id('writeOn')).tap();
    await element(by.id('postImageBottomBar')).tap();
    await element(by.text('Use last photo taken')).tap();
    await element(by.text('Choose')).tap();
    await element(by.id('postButtonOnCreatePost')).tap();
    await expect(element(by.id('writeOn'))).toBeVisible();
  });


  it('should be able to like artwork of another user', async () => {
    await element(by.id('controlsButton')).tap();
    await element(by.text('See my Public Profile')).tap();
    await element(by.id('followers')).tap();
    await element(by.text('Detox 2')).tap();
    await waitFor(element(by.id('artworkThumbnailOnArtistProfile')).atIndex(0)).toBeVisible();
    await element(by.id('confirmSwiper')).tap();
    await element(by.id('arrowViewMoreIcon')).atIndex(0).tap();
    await element(by.text('Detox art')).tap();
    await waitFor(element(by.id('likeBadge'))).toBeVisible();
    await element(by.id('artworkDeailsBadges')).atIndex(2).tap();  
    await element(by.id('artworkDeailsBadges')).atIndex(0).tap();  
    await expect(element(by.id('likeColored'))).toBeVisible();
  });

  it('should be able to comment artwork', async () => {
    await element(by.id('confirmSwiper')).tap();
    await waitFor(element(by.id('commentArtworkDetails'))).toBeVisible();
    await element(by.id('artworkDeailsBadges')).atIndex(0).tap();
    await element(by.text('Add comment')).tap(); 
    await waitFor(element(by.text('Type comment here'))).toBeVisible().withTimeout(200);
    await element(by.id('addCommentUnderArtowrk')).typeText("Detox comment\n");
    await waitFor(element(by.id('sendButtonOnComment'))).toBeVisible();
    await element(by.id('sendButtonOnComment')).tap();
    await waitFor(element(by.text('Reply'))).toBeVisible().withTimeout(200);
    await element(by.text('SEND')).tap();
    await expect(element(by.id('commentSentLabel'))).toBeVisible();
  });

  it('should be able to share artwork via message', async () => {
    await waitFor(element(by.id('artworkDeailsBadges')).atIndex(3)).toBeVisible();
    await element(by.id('confirmSwiper')).tap();
    await element(by.id('artworkDeailsBadges')).atIndex(3).tap();
    await element(by.text('Share via Direct Message')).tap();
    await element(by.text('Send message')).atIndex(0).tap();
    await expect(element(by.id('artworkDeailsBadges')).atIndex(2)).toHaveToggleValue(true);
    await expect(element(by.id('artworkDeailsBadges')).atIndex(2)).toHaveValue('1');
    await expect(element(by.id('messageSentLabel'))).toBeVisible();
  });
});