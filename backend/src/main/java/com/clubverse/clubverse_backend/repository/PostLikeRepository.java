
package com.clubverse.clubverse_backend.repository;

import com.clubverse.clubverse_backend.entity.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostLikeRepository
        extends JpaRepository<PostLike, Long> {

    Optional<PostLike> findByPostIdAndUserId(
            Long postId,
            Long userId);

    long countByPostId(Long postId);
}
