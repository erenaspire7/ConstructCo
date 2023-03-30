using Microsoft.EntityFrameworkCore;
using System.Drawing.Printing;
using System.Linq.Dynamic.Core;
using System.Reflection;

namespace backend.Data
{
    public class ApiResult<T>
    {
        private ApiResult(
            List<T> data,
            int count,
            int pageIndex,
            int pageSize,
            string? sortColumn,
            string? sortOrder
        )
        {
            Data = data;
            PageIndex = pageIndex;
            PageSize = pageSize;
            TotalCount = count;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            SortColumn = sortColumn;
            SortOrder = sortOrder;
        }

        public static async Task<ApiResult<T>> CreateAsync (
            IQueryable<T> source,
            int pageIndex,
            int pageSize,
            string? sortColumn = null,
            string? sortOrder = null,
            string? filterColumns = null,
            string? filterQuery = null
        )
        {
            if (!string.IsNullOrEmpty(filterColumns) && !string.IsNullOrEmpty(filterQuery) && validateColumnNames(filterColumns))
            {
                string[] filterColumnsArr = filterColumns.Split(',');
                
                string query = "{0}.Contains(@0)";

                for (int i = 0; i < filterColumnsArr.Length; i++)
                {
                    string pascalFilter = char.ToUpper(filterColumnsArr[i][0]) + filterColumnsArr[i].Substring(1);
                    
                    Type t = typeof(T);

                    PropertyInfo prop = t.GetProperty(pascalFilter);

                    if (prop.PropertyType != typeof(string))
                    {
                        filterColumnsArr[i] = filterColumnsArr[i] + ".toString()";
                    }
                    
                    if (i > 0)
                    {
                        query += " OR {" + i + "}.Contains(@0)";
                    }
                    
                }
                
                source = source.Where(
                    string.Format(query,
                    filterColumnsArr),
                    filterQuery);
            }

            var count = await source.CountAsync();

            if (!string.IsNullOrEmpty(sortColumn) && IsValidProperty(sortColumn))
            {
                sortOrder = !string.IsNullOrEmpty(sortOrder) && sortOrder.ToUpper() == "ASC" ? "ASC" : "DESC";

                source = source.OrderBy(string.Format(
                    "{0} {1}",
                    sortColumn,
                    sortOrder
                ));
            }

            if (count > (pageIndex * pageSize))
            {
                source = source.Skip(pageIndex * pageSize);
            } else
            {
                pageIndex = 0;
            }
            
            source = source.Take(pageSize);

            var data = await source.ToListAsync();

            return new ApiResult<T>(
                data,
                count,
                pageIndex,
                pageSize,
                sortColumn,
                sortOrder
            );
        }

        public static bool IsValidProperty(
            string propertyName,
            bool throwExceptionIfNotFound = true
        )
        {
            var prop = typeof(T).GetProperty(
                propertyName,
                BindingFlags.IgnoreCase |
                BindingFlags.Public |
                BindingFlags.Instance
            );

            if (prop == null && throwExceptionIfNotFound)
            {
                throw new NotSupportedException(
                    string.Format($"ERROR: Property '{propertyName}' does not exist.")
                );
            }
            return prop != null;
        }

        private static bool validateColumnNames(string filterColumns)
        {
            string[] filterColumnsArr = filterColumns.Split(',');

            for(int i = 0; i < filterColumnsArr.Length; i++)
            {
                string filterColumn = filterColumnsArr[i];

                if(string.IsNullOrEmpty(filterColumn) || !IsValidProperty(filterColumn))
                {
                    return false;
                }
            }
            return true;
        }

        public List<T> Data { get; private set; }

        public int PageIndex { get; private set; }

        public int PageSize { get; private set; }

        public int TotalCount { get; private set; }

        public int TotalPages { get; private set; }

        public string SortColumn { get; set; }

        public string SortOrder { get; set; }

        public bool HasPreviousPage
        {
            get
            {
                return (PageIndex > 0);
            }
        }

        public bool HasNextPage
        {
            get
            {
                return ((PageIndex + 1) < TotalPages);
            }
        }
    }
}
