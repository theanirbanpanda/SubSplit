package com.subsplit.auth.dto;

import com.subsplit.common.entity.User;
import com.subsplit.common.entity.UserProfile;

public class UserResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String state;
    private String city;
    private String bio;
    private String profileImage;
    private String role;

    public UserResponse() {
    }

    public UserResponse(Long id, String firstName, String lastName, String email, String phone, String state, String city, String bio, String profileImage, String role) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.state = state;
        this.city = city;
        this.bio = bio;
        this.profileImage = profileImage;
        this.role = role;
    }

    public static UserResponse fromUser(User user) {
        if (user == null) {
            return null;
        }
        String roleName = (user.getRole() != null) ? user.getRole().getName() : "USER";
        UserProfile prof = user.getProfile();

        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setProfileImage(user.getProfileImage());
        response.setRole(roleName);

        if (prof != null) {
            response.setPhone(prof.getPhone());
            response.setState(prof.getState());
            response.setCity(prof.getCity());
            response.setBio(prof.getBio());
        }

        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
