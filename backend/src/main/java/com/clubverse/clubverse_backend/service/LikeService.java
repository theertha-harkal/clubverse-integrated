package com.clubverse.clubverse_backend.service;

import com.clubverse.clubverse_backend.entity.Like;
import com.clubverse.clubverse_backend.entity.Post;
import com.clubverse.clubverse_backend.entity.User;
import com.clubverse.clubverse_backend.repository.LikeRepository;
import com.clubverse.clubverse_backend.repository.PostRepository;
import com.clubverse.clubverse_backend.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public LikeService(LikeRepository likeRepository,
                       PostRepository postRepository,
                       UserRepository userRepository) {
        this.likeRepository = likeRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public boolean toggleLike(Long postId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Check if like already exists
        boolean liked = likeRepository.existsByPostAndUser(post, user);
        
        if (liked) {
            // Unlike: delete the existing like
            likeRepository.deleteByPostAndUser(post, user);
            post.setLikeCount(post.getLikeCount() - 1);
            postRepository.save(post);
            return false;
        } else {
            // Like: create a new like
            Like like = new Like();
            like.setPost(post);
            like.setUser(user);
            like.setCreatedAt(LocalDateTime.now());
            
            likeRepository.saveAndFlush(like);
            post.setLikeCount(post.getLikeCount() + 1);
            postRepository.save(post);
            return true;
        }
    }

    public boolean hasUserLiked(Long postId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        return likeRepository.existsByPostAndUser(post, user);
    }

    public long getLikeCount(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return likeRepository.countByPost(post);
    }
}