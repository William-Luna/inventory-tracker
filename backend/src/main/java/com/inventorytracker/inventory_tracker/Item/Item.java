package com.inventorytracker.inventory_tracker.Item;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "items")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private String category;
    @Column(name = "buy_price")
    private BigDecimal buyPrice;
    @Column(name = "buy_date")
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

    public Item() {
        // Default constructor required by JPA
    }

    public Item(int id, String name, String category, BigDecimal buyPrice, Date buyDate) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.buyPrice = buyPrice;
        this.buyDate = buyDate;
    }

    public Item(int id, String name, String category, BigDecimal buyPrice, Date buyDate, BigDecimal sellPrice, Date sellDate, BigDecimal postagePrice, BigDecimal feesPrice, String photoUrl) {
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
}
