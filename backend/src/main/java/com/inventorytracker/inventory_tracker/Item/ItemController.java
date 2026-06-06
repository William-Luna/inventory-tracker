package com.inventorytracker.inventory_tracker.Item;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
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
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean unsold) {
        if (Boolean.TRUE.equals(unsold)) return itemService.getUnsoldItems(); //unsold param
        else if (category != null) return itemService.getItemsByCategory(category); //category param
        else if (dateSoldBefore != null && dateSoldAfter != null) return itemService.getSoldItems(dateSoldBefore, dateSoldAfter); //sold items between dates param
        else if (name != null) return itemService.getItemsByName(name); //specific name param
        else return itemService.getItems();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Item> getItem(@PathVariable Integer id) {
        return itemService.getItemById(id)
                .map(item -> new ResponseEntity<>(item, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Item> addItem(@Valid @RequestBody Item item) {
        Item createdItem = itemService.addItem(item);
        return new ResponseEntity<>(createdItem, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Item> updateItem(@PathVariable Integer id, @RequestBody Item item) {
        item.setId(id);

        Item resultItem = itemService.updateItem(item);
        if (resultItem != null) {
            return new ResponseEntity<>(resultItem, HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Integer id) {
        boolean deleted = itemService.deleteItem(id);
        if (!deleted) return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        else return new ResponseEntity<>(HttpStatus.OK);
    }
}
