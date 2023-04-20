<?php

namespace App\Http\Controllers;

use App\Models\PostImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\PostImage\StoreRequest;
use App\Http\Resources\PostImage\PostImageResource;

class PostImageController extends Controller
{
    public function store(StoreRequest $request)
    {
        $path = Storage::disk('public')->put('/images', $request['image']);
        $image = PostImage::create([
            'path' => $path,
            'user_id' => auth()->id()
        ]);
        return new PostImageResource($image);
    }
}
