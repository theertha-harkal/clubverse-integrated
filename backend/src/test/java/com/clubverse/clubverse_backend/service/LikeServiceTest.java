package com.clubverse.clubverse_backend.service;

import com.clubverse.clubverse_backend.entity.Like;
import com.clubverse.clubverse_backend.entity.Post;
import com.clubverse.clubverse_backend.entity.User;
import com.clubverse.clubverse_backend.repository.LikeRepository;
import com.clubverse.clubverse_backend.repository.PostRepository;
import com.clubverse.clubverse_backend.repository.UserRepository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LikeServiceTest {

    @Mock
    private LikeRepository likeRepository;

    @Mock
    private PostRepository postRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private LikeService likeService;

    private User user() {
        User user = new User();
        user.setId(1L);
        user.setName("Test User");
        user.setEmail("test@college.edu");
        user.setRole(User.Role.STUDENT);
        return user;
    }

    private Post post() {
        Post post = new Post();
        post.setTitle("Test Post");
        post.setContent("Test content");
        post.setLikeCount(0);
        post.setUser(user());
        try {
            java.lang.reflect.Field field = Post.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(post, 10L);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return post;
    }

    @Test
    @DisplayName("TC-LIKE-01: liking a post increments count and returns true")
    void likePost_success() {
        User u = user();
        Post p = post();
        when(userRepository.findByEmail(u.getEmail())).thenReturn(Optional.of(u));
        when(postRepository.findById(p.getId())).thenReturn(Optional.of(p));
        when(likeRepository.saveAndFlush(any(Like.class))).thenAnswer(inv -> inv.getArgument(0));

        boolean liked = likeService.toggleLike(10L, "test@college.edu");

        assertTrue(liked);
        verify(likeRepository).saveAndFlush(any(Like.class));
        verify(postRepository).save(argThat(po -> po.getLikeCount() == 1));
    }

    @Test
    @DisplayName("TC-LIKE-02: unliking a post decrements count and returns false")
    void unlikePost_success() {
        User u = user();
        Post p = post();
        p.setLikeCount(5);
        when(userRepository.findByEmail(u.getEmail())).thenReturn(Optional.of(u));
        when(postRepository.findById(p.getId())).thenReturn(Optional.of(p));
        // The like exists, so we go into the unlike branch
        when(likeRepository.existsByPostAndUser(any(Post.class), any(User.class))).thenReturn(true);
        // deleteByPostAndUser is called
        doNothing().when(likeRepository).deleteByPostAndUser(any(Post.class), any(User.class));

        boolean liked = likeService.toggleLike(10L, "test@college.edu");

        assertFalse(liked);
        verify(likeRepository, never()).saveAndFlush(any(Like.class));
        verify(likeRepository).deleteByPostAndUser(any(Post.class), any(User.class));
        verify(postRepository).save(argThat(po -> po.getLikeCount() == 4));
    }

    @Test
    @DisplayName("TC-LIKE-03: hasUserLiked returns true when like exists")
    void hasUserLiked_true() {
        User u = user();
        Post p = post();
        when(userRepository.findByEmail(u.getEmail())).thenReturn(Optional.of(u));
        when(postRepository.findById(p.getId())).thenReturn(Optional.of(p));
        when(likeRepository.existsByPostAndUser(any(Post.class), any(User.class))).thenReturn(true);

        boolean liked = likeService.hasUserLiked(10L, "test@college.edu");

        assertTrue(liked);
    }

    @Test
    @DisplayName("TC-LIKE-04: hasUserLiked returns false when like doesn't exist")
    void hasUserLiked_false() {
        User u = user();
        Post p = post();
        when(userRepository.findByEmail(u.getEmail())).thenReturn(Optional.of(u));
        when(postRepository.findById(p.getId())).thenReturn(Optional.of(p));
        when(likeRepository.existsByPostAndUser(any(Post.class), any(User.class))).thenReturn(false);

        boolean liked = likeService.hasUserLiked(10L, "test@college.edu");

        assertFalse(liked);
    }

    @Test
    @DisplayName("TC-LIKE-05: getLikeCount returns correct count")
    void getLikeCount_success() {
        Post p = post();
        when(postRepository.findById(10L)).thenReturn(Optional.of(p));
        when(likeRepository.countByPost(p)).thenReturn(7L);

        long count = likeService.getLikeCount(10L);

        assertEquals(7L, count);
    }

    @Test
    @DisplayName("TC-LIKE-06: toggleLike throws when user not found")
    void toggleLike_userNotFound() {
        when(userRepository.findByEmail("ghost@college.edu")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> likeService.toggleLike(10L, "ghost@college.edu"));

        assertEquals("User not found", ex.getMessage());
    }

    @Test
    @DisplayName("TC-LIKE-07: toggleLike throws when post not found")
    void toggleLike_postNotFound() {
        User u = user();
        when(userRepository.findByEmail(u.getEmail())).thenReturn(Optional.of(u));
        when(postRepository.findById(999L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> likeService.toggleLike(999L, u.getEmail()));

        assertEquals("Post not found", ex.getMessage());
    }
}