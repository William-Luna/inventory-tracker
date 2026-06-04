package com.inventorytracker.inventory_tracker.Item;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "items")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotBlank
    private String name;
    @NotBlank
    private String category;
    @NotNull
    @PositiveOrZero
    @Column(name = "buy_price")
    private BigDecimal buyPrice;
    @Column(name = "buy_date")
    @NotNull
    private Date buyDate;
    @Column(name = "sell_price")
    private BigDecimal sellPrice;
    @Column(name = "sell_date")
    private Date sellDate;
    @Column(name = "postage_price")
    private BigDecimal postagePrice;
    @Column(name = "fees_price")
    private BigDecimal feesPrice;
    @Column(name = "photo_url")
    private String photoUrl;
    private String location;

    public Item() {
        // Default constructor required by JPA
    }

    public Item(int id, String name, String category, BigDecimal buyPrice, Date buyDate, String location) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.buyPrice = buyPrice;
        this.buyDate = buyDate;
        this.location = location;
    }

    public Item(int id, String name, String category, BigDecimal buyPrice, Date buyDate, BigDecimal sellPrice, Date sellDate, BigDecimal postagePrice, BigDecimal feesPrice, String photoUrl, String location) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.buyPrice = buyPrice;
        this.buyDate = buyDate;
        this.sellPrice = sellPrice;
        this.sellDate = sellDate;
        this.postagePrice = postagePrice;
        this.feesPrice = feesPrice;
        this.photoUrl = photoUrl;
        this.location = location;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getBuyPrice() {
        return buyPrice;
    }

    public void setBuyPrice(BigDecimal buyPrice) {
        this.buyPrice = buyPrice;
    }

    public Date getBuyDate() {
        return buyDate;
    }

    public void setBuyDate(Date buyDate) {
        this.buyDate = buyDate;
    }

    public BigDecimal getSellPrice() {
        return sellPrice;
    }

    public void setSellPrice(BigDecimal sellPrice) {
        this.sellPrice = sellPrice;
    }

    public Date getSellDate() {
        return sellDate;
    }

    public void setSellDate(Date sellDate) {
        this.sellDate = sellDate;
    }

    public BigDecimal getPostagePrice() {
        return postagePrice;
    }

    public void setPostagePrice(BigDecimal postagePrice) {
        this.postagePrice = postagePrice;
    }

    public BigDecimal getFeesPrice() {
        return feesPrice;
    }

    public void setFeesPrice(BigDecimal feesPrice) {
        this.feesPrice = feesPrice;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public String getLocation() {return location;}

    public void setLocation(String location) {this.location = location;}
}
