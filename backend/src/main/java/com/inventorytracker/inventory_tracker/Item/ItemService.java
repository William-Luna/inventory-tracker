package com.inventorytracker.inventory_tracker.Item;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class ItemService {
    private final ItemRepository itemRepository;

    @Autowired
    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public List<Item> getItems() {
        return itemRepository.findAll();
    }

    public List<Item> getItemsByName (String searchString) {
        return itemRepository.findAll().stream()
                .filter(item -> item.getName().contains(searchString))
                .collect(Collectors.toList());
    }

    public List<Item> getUnsoldItems() {
        return itemRepository.findBySellDateIsNull();
    }

    public List<Item> getSoldItems(Date beforeDate, Date afterDate) {
        return itemRepository.findBySellDateIsNotNull().stream()
                .filter(item -> beforeDate.before(item.getSellDate()) && afterDate.after(item.getSellDate()))
                .collect(Collectors.toList());
    }

    public Optional<Item> getItemById(int id) {
        return itemRepository.findById(id);
    }

    public List<Item> getItemsByCategory(String category) {
        return itemRepository.findAll().stream()
                .filter(item -> category.equals(item.getCategory()))
                .collect(Collectors.toList());
    }

    public Item addItem (Item item) {
        itemRepository.save(item);
        return item;
    }

    public Item updateItem(Item updatedItem) {
        Optional<Item> existingItem = itemRepository.findById(updatedItem.getId());
        if (existingItem.isPresent()) {
            Item itemToBeUpdated = existingItem.get();
            itemToBeUpdated.setName(updatedItem.getName());
            itemToBeUpdated.setCategory(updatedItem.getCategory());
            itemToBeUpdated.setBuyPrice(updatedItem.getBuyPrice());
            itemToBeUpdated.setBuyDate(updatedItem.getBuyDate());
            itemToBeUpdated.setSellPrice(updatedItem.getSellPrice());
            itemToBeUpdated.setSellDate(updatedItem.getSellDate());
            itemToBeUpdated.setFeesPrice(updatedItem.getFeesPrice());
            itemToBeUpdated.setPostagePrice(updatedItem.getPostagePrice());
            itemToBeUpdated.setPhotoUrl(updatedItem.getPhotoUrl());

            itemRepository.save(itemToBeUpdated);
            return itemToBeUpdated;
        }
        return null;
    }

    @Transactional
    public void deleteItem(int id) {
        itemRepository.deleteById(id);
    }
}
