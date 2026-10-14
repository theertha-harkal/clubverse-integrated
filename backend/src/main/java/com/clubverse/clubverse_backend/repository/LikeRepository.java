package com.clubverse.clubverse_backend.repository;

import com.clubverse.clubverse_backend.entity.Like;
import com.clubverse.clubverse_backend.entity.Post;
import com.clubverse.clubverse_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {

    Optional<Like> findByPostAndUser(Post post, User user);

    boolean existsByPostAndUser(Post post, User user);

    long countByPost(Post post);

    long countByPostId(Long postId);

    @Modifying
    @Query("DELETE FROM Like l WHERE l.post = :post AND l.user = :user")
    void deleteByPostAndUser(@Param("post") Post post, @Param("user") User user);
}