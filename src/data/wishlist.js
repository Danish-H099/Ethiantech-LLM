/**
 * Wishlist — course ids the learner has bookmarked from the catalog.
 * Distinct from enrollment (a wishlisted course is not yet enrolled). Only
 * ids are stored; presentation fields are resolved from the catalog by the
 * store/repository (see src/services/stores/wishlistStore.js).
 */

/** @type {number[]} */
export const wishlist = [7, 8, 9];