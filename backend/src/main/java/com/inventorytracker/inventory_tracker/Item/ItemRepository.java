package com.inventorytracker.inventory_tracker.Item;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemRepository extends JpaRepository<Item, Integer> {
    void deleteByName(String name);

    Optional<Item> findByName(String name);

    List<Item> findBySellDateIsNull();
    List<Item> findBySellDateIsNotNull();
}
