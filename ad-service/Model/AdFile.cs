using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace AdService.Model
{
    public class AdFile
    {
        public static string FileFolder = "adFolder";
        public string Name { get; set; }
        public DateTime CreationTime { get; set; } 

        public static List<AdFile> CreateList(string webRootPath)
        {
            var imageDirectory = Path.Combine(webRootPath, FileFolder);
            var filePaths = Directory.GetFiles(imageDirectory);

            return CreateList(filePaths);
        }

        public static List<AdFile> CreateList(IEnumerable filePath)
        {
            return (
                from string file in filePath
                select new AdFile {Name = Path.GetFileName(file), CreationTime = File.GetCreationTime(file)}
            ).ToList();
        }
    }
}