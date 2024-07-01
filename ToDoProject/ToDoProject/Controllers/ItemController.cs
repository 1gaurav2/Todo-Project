using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDoProject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ToDoProject.DTOs;

namespace ToDoProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly AppDBContext _dbContext;

        public ItemController(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ItemDTO>>> GetAllItems(string search = "", string type = "", string priority = "")
        {
            try
            {
                var items = await _dbContext.Items
                    .FromSqlRaw("EXECUTE dbo.GetItems @search={0}, @type={1}, @priority={2}", search, type, priority)
                    .ToListAsync();

                if (items == null)
                {
                    return new List<ItemDTO>();
                }

                var itemDTOs = items.Select(item => new ItemDTO
                {
                    ItemId = item.ItemId,
                    ItemName = item.ItemName,
                    Description = item.Description,
                    Priority = item.Priority,
                    Type = item.Type
                }).ToList();

                return Ok(itemDTOs);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status400BadRequest, $"Error while fetching data");
            }
        }



        [HttpGet("{id}")]
        public async Task<ActionResult<ItemDTO>> GetItemById(int id)
        {
            try
            {
                var item = await _dbContext.Items.FindAsync(id);
                if (item == null)
                {
                    return NotFound();
                }

                // Map the entity to the DTO
                var itemDTO = new ItemDTO
                {
                    ItemId = item.ItemId,
                    ItemName = item.ItemName,
                    Description = item.Description,
                    Priority = item.Priority,
                    Type = item.Type
                };

                return Ok(itemDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Unable to fetch data");
            }
        }

        [HttpPost]
        public async Task<ActionResult<ItemDTO>> AddItem(ItemDTO itemDTO)
        {
            try
            {
                // Map the DTO to the entity model
                var item = new Item
                {
                    ItemName = itemDTO.ItemName,
                    Description = itemDTO.Description,
                    Priority = itemDTO.Priority,
                    Type = itemDTO.Type
                };

                _dbContext.Items.Add(item);
                await _dbContext.SaveChangesAsync();

                // Update the DTO with the generated ID
                itemDTO.ItemId = item.ItemId;

                return CreatedAtAction(nameof(AddItem), new { id = itemDTO.ItemId }, itemDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Unable to add items");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> EditItem(int id, ItemDTO itemDTO)
        {
            try
            {
                if (id != itemDTO.ItemId)
                {
                    return BadRequest("ID mismatch");
                }

                var item = await _dbContext.Items.FindAsync(id);
                if (item == null)
                {
                    return NotFound("Record not found");
                }

                // Map the DTO to the entity model
                item.ItemName = itemDTO.ItemName;
                item.Description = itemDTO.Description;
                item.Priority = itemDTO.Priority;
                item.Type = itemDTO.Type;

                _dbContext.Entry(item).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();
                return Ok();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IsItemAvailable(id))
                {
                    return NotFound("Record not found");
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Unable to edit data");
            }
        }

        private bool IsItemAvailable(int id)
        {
            return _dbContext.Items.Any(x => x.ItemId == id);
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteItem(int id)
        {
            try
            {
                var item = await _dbContext.Items.FindAsync(id);
                if (item == null)
                {
                    return NotFound();
                }

                _dbContext.Items.Remove(item);
                await _dbContext.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Unable to delete item");
            }
        }

        //[HttpGet("type/{type}")]
        //public async Task<ActionResult<IEnumerable<Item>>> GetItemByType(string type)
        //{
        //    try
        //    {
        //        if (type.ToLower() == "all")
        //        {
        //            return await GetAllItems();
        //        }
        //        else
        //        {

        //            var items = await _dbContext.Items.Where(x => x.Type == type.ToLower()).ToListAsync();
        //            if (items == null || items.Count == 0)
        //            {
        //                return NotFound();
        //            }
        //            return Ok(items);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving items of type {type}: {ex.Message}");
        //    }
        //}


        //[HttpGet("priority/{priority}")]
        //public async Task<ActionResult<IEnumerable<Item>>> GetItemByPriority(string priority)
        //{
        //    try
        //    {
        //        if (priority.ToLower() == "all")
        //        {
        //            return await GetAllItems();
        //        }
        //        else
        //        {

        //            var items = await _dbContext.Items.Where(x => x.Type == priority.ToLower()).ToListAsync();
        //            if (items == null || items.Count == 0)
        //            {
        //                return NotFound();
        //            }
        //            return Ok(items);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving items of Priority {priority}: {ex.Message}");
        //    }
        //}


        //[HttpGet("search")]
        //public async Task<ActionResult<IEnumerable<Item>>> SearchItems([FromQuery] string? term)
        //{
        //    if (_dbContext.Items == null)
        //    {
        //        return NotFound();
        //    }

        //    var query = _dbContext.Items.AsQueryable();

        //    if (!string.IsNullOrEmpty(term))
        //    {
        //        query = query.Where(x => x.ItemName.Contains(term) || x.Description.Contains(term) || x.Priority.Contains(term));
        //    }

        //    var items = await query.ToListAsync();

        //    if (items == null || !items.Any())
        //    {
        //        return NotFound();
        //    }

        //    return Ok(items);
        //}
    }
}
