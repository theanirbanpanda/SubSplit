import sys
import re

def insert_after(file_path, search_str, insert_str):
    with open(file_path, "r") as f:
        content = f.read()
    if insert_str.strip() in content:
        return
    idx = content.find(search_str)
    if idx == -1:
        print(f"Could not find '{search_str}' in {file_path}")
        return
    idx += len(search_str)
    new_content = content[:idx] + "\n" + insert_str + content[idx:]
    with open(file_path, "w") as f:
        f.write(new_content)

def insert_before_last_brace(file_path, insert_str):
    with open(file_path, "r") as f:
        content = f.read()
    if insert_str.strip() in content:
        return
    idx = content.rfind("}")
    if idx == -1:
        print(f"Could not find '}}' in {file_path}")
        return
    new_content = content[:idx] + insert_str + "\n" + content[idx:]
    with open(file_path, "w") as f:
        f.write(new_content)

# Patch MarketplaceController.java
controller_patch = """
    @DeleteMapping("/listings/{id}/reviews/{reviewId}")
    public ResponseEntity<ApiResponse<String>> deleteListingReview(
            Authentication authentication,
            @PathVariable Long id,
            @PathVariable Long reviewId) {
        User currentUser = getAuthenticatedUser(authentication);
        marketplaceService.deleteListingReview(currentUser, id, reviewId);
        return ResponseEntity.ok(ApiResponse.success("Review deleted successfully", "Review has been deleted"));
    }
"""
insert_before_last_brace("../../backend/src/main/java/com/subsplit/marketplace/controller/MarketplaceController.java", controller_patch)

# Patch MarketplaceService.java
service_patch = "    void deleteListingReview(User user, Long listingId, Long reviewId);"
insert_before_last_brace("../../backend/src/main/java/com/subsplit/marketplace/service/MarketplaceService.java", service_patch)

# Patch MarketplaceServiceImpl.java
service_impl_patch = """
    @Override
    public void deleteListingReview(User user, Long listingId, Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new com.subsplit.common.exception.ResourceNotFoundException("Review not found"));
        if (review.getReviewer() == null || !review.getReviewer().getId().equals(user.getId())) {
            throw new com.subsplit.common.exception.UnauthorizedException("You can only delete your own reviews");
        }
        reviewRepository.delete(review);
    }
"""
insert_before_last_brace("../../backend/src/main/java/com/subsplit/marketplace/service/impl/MarketplaceServiceImpl.java", service_impl_patch)

print("Patch applied.")
