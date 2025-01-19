from marshmallow import Schema, fields, validate


class PersonalStorySchema(Schema):
    ID = fields.Int(dump_only=True)
    Content = fields.Str(required=True,validate=validate.Length(max=2000))
    UserID = fields.Int(dump_only=True)  # Only include UserID
    RecipeID = fields.Int(required=True)  # Only include RecipeID
    Timestamp = fields.DateTime(dump_only=True)

    class Meta:
        name = "PersonalStorySchema"

class RecipeSchema(Schema):
    ID = fields.Int(dump_only=True)
    RecipeName = fields.Str(required=True, validate=validate.Length(max=100))
    Ingredients = fields.Str(required=True,validate=validate.Length(max=1000))
    Steps = fields.Str(required=True,validate=validate.Length(max=3000))
    Region = fields.Str(missing=None) #region is optional
    Emotion = fields.Str( validate=validate.OneOf(["Comfort", "Nostalgia", "Joy", "Celebration", "Adventure", "Homesickness", "Love"]))
    created_at = fields.DateTime(dump_only=True)
    #Stories = fields.List(fields.Dict(), dump_only=True)
    Status = fields.Str(dump_only=True)
    Stories = fields.List(fields.Nested(PersonalStorySchema))  # Add Stories relationship here

    class Meta:
        name = "RecipeSchema"

class RecipeUpdateSchema(Schema):
    RecipeName = fields.Str(missing=None,validate=validate.Length(max=100))
    Ingredients = fields.Str(missing=None,validate=validate.Length(max=1000))
    Steps = fields.Str(missing=None,validate=validate.Length(max=3000))
    Region = fields.Str(missing=None)
    Emotion = fields.Str( validate=validate.OneOf(["Comfort", "Nostalgia", "Joy", "Celebration", "Adventure", "Homesickness", "Love"]), missing=None)
    Status = fields.Str()

    class Meta:
        name = "RecipeUpdateSchema"

class ConfessionSchema(Schema):
    ID = fields.Int(dump_only=True)
    Admission = fields.Str(required=True, validate=validate.Length(max=2000))
    UserID = fields.Int(dump_only=True) 
    Timestamp = fields.DateTime(dump_only=True)
    Status = fields.Str(dump_only=True)  

    class Meta:
        name = "ConfessionSchema"

class UserSchema(Schema):
    ID = fields.Int(dump_only=True)
    UserName = fields.Str(required=True,validate=validate.Length(max=50))
    Email = fields.Email(required=True,validate=validate.Length(max=100))
    Password = fields.Str(required=True, load_only=True,validate=validate.Length(min=8)) 
    Role = fields.Str(dump_only=True)
    Confessions = fields.List(fields.Dict(), dump_only=True)
    Stories = fields.List(fields.Dict(), dump_only=True)
    class Meta:
        name = "UserSchema"

class RecipePatchSchema(Schema):
    RecipeName = fields.Str(validate=validate.Length(max=100))
    Ingredients = fields.Str(validate=validate.Length(max=1000))
    Steps = fields.Str(validate=validate.Length(max=2000))
    Region = fields.Str()
    Emotion = fields.Str(validate=validate.OneOf(["Comfort", "Nostalgia", "Joy", "Celebration", "Adventure", "Homesickness", "Love"]))

    class Meta:
        name = "RecipePatchSchema"