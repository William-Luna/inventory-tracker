package com.inventorytracker.inventory_tracker.Item;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "api/items")
public class ItemController {
    private final ItemService itemService;

    @Autowired
    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping
    public List<Item> getItems(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Date dateSoldBefore,
            @RequestParam(required = false) Date dateSoldAfter,
            @RequestParam(required = false) String category) {
        if (category != null) return itemService.getItemsByCategory(category);
        else if (dateSoldBefore != null && dateSoldAfter != null) return itemService.getSoldItems(dateSoldBefore, dateSoldAfter);
        else if (name != null) return itemService.getItemsByName(name);
        else return itemService.getItems();
    }

    @GetMapping("/{id}")
    public Optional<Item> getItem(@PathVariable Integer id) {
        return itemService.getItemById(id);
    }

    @PostMapping
    public ResponseEntity<Item> addItem(@RequestBody Item item) {
        Item createdItem = itemService.addItem(item);
        return new ResponseEntity<>(createdItem, HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<Item> updateItem(@RequestBody Item item) {
        Item resultItem = itemService.updateItem(item);
        if (resultItem != null) {
            return new ResponseEntity<>(resultItem, HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteItem(@PathVariable Integer id) {
        itemService.deleteItem(id);
        return new ResponseEntity<>("Player deleted successfully.", HttpStatus.OK);
    }
}
