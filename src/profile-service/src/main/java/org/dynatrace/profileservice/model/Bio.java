package org.dynatrace.profileservice.model;

import javax.persistence.*;

@Entity
@Table(name = "bio")
public class Bio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int userId;
    private String bioText;

    public Bio(int id, int userId, String bioText) {
        this.id = id;
        this.userId = userId;
        this.bioText = bioText;
    }

    public Bio(int userId, String bioText) {
        this.userId = userId;
        this.bioText = bioText;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getBioText() {
        return bioText;
    }

    public void setBioText(String bioText) {
        this.bioText = bioText;
    }
}
